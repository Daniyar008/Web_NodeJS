import { Request, Response } from 'express';
import { prisma } from '../index';
import { InstitutionType } from '@prisma/client';

export const getInstitutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        _count: {
          select: { users: true, departments: true, classes: true }
        }
      }
    });
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching institutions', error });
  }
};

export const getInstitutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        departments: true,
        classes: true,
      }
    });
    
    if (!institution) {
      res.status(404).json({ message: 'Institution not found' });
      return;
    }
    
    res.json(institution);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching institution', error });
  }
};

export const createInstitution = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, shortName, type, inn, address, phone, email, website } = req.body;
    
    const institution = await prisma.institution.create({
      data: {
        name,
        shortName,
        type: type as InstitutionType,
        inn,
        address,
        phone,
        email,
        website
      }
    });
    
    res.status(201).json(institution);
  } catch (error) {
    res.status(500).json({ message: 'Error creating institution', error });
  }
};

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { institutionId } = req.params;
    const { name, description, headId } = req.body;
    
    // Check if institution exists
    const inst = await prisma.institution.findUnique({ where: { id: institutionId } });
    if (!inst) {
      res.status(404).json({ message: 'Institution not found' });
      return;
    }
    
    const department = await prisma.department.create({
      data: {
        name,
        description,
        institutionId,
        headId
      }
    });
    
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error creating department', error });
  }
};
