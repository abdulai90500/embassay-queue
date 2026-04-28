'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendTicketNotifications } from '@/lib/notifications';

// import { Status } from '@prisma/client'; // Temporarily removed due to generation lag
type Status = 'WAITING' | 'SERVING' | 'COMPLETED' | 'CANCELLED';

export async function getServices() {
  return await prisma.service.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createTicket(
  serviceId: string, 
  customerName?: string, 
  customerDetails?: string,
  phoneNumber?: string,
  email?: string
) {
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new Error('Service not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countToday = await prisma.ticket.count({
      where: {
        serviceId,
        createdAt: { gte: today },
      },
    });

    const tokenNumber = `${service.prefix}-${(countToday + 1).toString().padStart(3, '0')}`;

    const maxPosition = await prisma.ticket.aggregate({
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? 0) + 1;

    const ticket = await prisma.ticket.create({
      data: {
        tokenNumber,
        serviceId,
        position,
        status: 'WAITING',
        customerName,
        customerDetails,
        phoneNumber,
        email,
      },
      include: {
        service: true,
      },
    });

    // Send real email (with QR code) and SMS notifications
    if (email || phoneNumber) {
      // Fire-and-forget — don't block ticket creation if notification fails
      sendTicketNotifications({
        customerName: ticket.customerName ?? 'Valued Customer',
        tokenNumber: ticket.tokenNumber,
        serviceName: ticket.service.name,
        position: ticket.position,
        ticketId: ticket.id,
        email,
        phoneNumber,
      }).catch((err) => console.error('[Notification Error]', err));
    }

    revalidatePath('/');
    revalidatePath('/display');
    revalidatePath('/staff');

    return { success: true, ticket };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { success: false, error: 'Failed to generate ticket' };
  }
}

export async function getQueueData() {
  const serving = await prisma.ticket.findMany({
    where: { status: 'SERVING' },
    include: { service: true },
    orderBy: { updatedAt: 'asc' },
  });

  const waiting = await prisma.ticket.findMany({
    where: { status: 'WAITING' },
    include: { service: true },
    orderBy: { position: 'asc' },
    take: 10,
  });

  const nextInLine = waiting[0] || null;

  return { serving, waiting, nextInLine };
}

export async function callNext(serviceId?: string, counterNumber?: string) {
  try {
    // Find the next waiting ticket (optionally for a specific service)
    const nextTicket = await prisma.ticket.findFirst({
      where: {
        status: 'WAITING',
        ...(serviceId ? { serviceId } : {}),
      },
      orderBy: { position: 'asc' },
    });

    if (!nextTicket) return { success: false, message: 'No more applicants in queue' };

    // Update status to SERVING and assign counter
    await prisma.ticket.update({
      where: { id: nextTicket.id },
      data: { 
        status: 'SERVING',
        counterNumber: counterNumber || '1'
      },
    });

    revalidatePath('/');
    revalidatePath('/display');
    revalidatePath('/staff');

    return { success: true, ticket: nextTicket };
  } catch (error) {
    console.error('Error calling next:', error);
    return { success: false, error: 'Failed to call next applicant' };
  }
}

export async function completeService(ticketId: string) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'COMPLETED' },
    });

    revalidatePath('/');
    revalidatePath('/display');
    revalidatePath('/staff');

    return { success: true };
  } catch (error) {
    console.error('Error completing service:', error);
    return { success: false, error: 'Failed to complete service' };
  }
}

export async function addService(name: string, prefix: string) {
  try {
    const service = await prisma.service.create({
      data: { name, prefix },
    });
    revalidatePath('/');
    revalidatePath('/staff/services');
    return { success: true, service };
  } catch (error) {
    console.error('Error adding service:', error);
    return { success: false, error: 'Failed to add service' };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/staff/services');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}

export async function getAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalToday = await prisma.ticket.count({
    where: { createdAt: { gte: today } },
  });

  const completedToday = await prisma.ticket.findMany({
    where: { 
      status: 'COMPLETED',
      createdAt: { gte: today }
    },
  });

  // Calculate average wait time
  let totalWaitTime = 0;
  completedToday.forEach((ticket: any) => {
    const wait = ticket.updatedAt.getTime() - ticket.createdAt.getTime();
    totalWaitTime += wait;
  });

  const avgWaitTime = completedToday.length > 0 
    ? Math.round(totalWaitTime / completedToday.length / 60000) // in minutes
    : 0;

  const services = await prisma.service.findMany({
    include: {
      _count: {
        select: { tickets: { where: { createdAt: { gte: today } } } }
      }
    }
  });

  return {
    totalToday,
    completedCount: completedToday.length,
    avgWaitTime,
    serviceStats: services.map((s: any) => ({
      name: s.name,
      count: s._count.tickets,
    }))
  };
}

export async function resetQueue() {
  try {
    await prisma.ticket.deleteMany({});
    revalidatePath('/');
    revalidatePath('/staff');
    revalidatePath('/display');
    return { success: true };
  } catch (error) {
    console.error('Error resetting queue:', error);
    return { success: false, error: 'Failed to reset queue' };
  }
}

export async function getAllTickets() {
  return await prisma.ticket.findMany({
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateTicket(id: string, data: { customerName?: string, customerDetails?: string, status?: Status, serviceId?: string }) {
  try {
    await prisma.ticket.update({
      where: { id },
      data,
    });
    revalidatePath('/staff/applications');
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket:', error);
    return { success: false, error: 'Failed to update ticket' };
  }
}

export async function deleteTicket(id: string) {
  try {
    await prisma.ticket.delete({ where: { id } });
    revalidatePath('/staff/applications');
    return { success: true };
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return { success: false, error: 'Failed to delete ticket' };
  }
}
