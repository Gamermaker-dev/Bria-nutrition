import type { Prisma } from "../../../../prisma/generated/prisma/client";

export const physicalType = {
    select: {
    id: true,
    name: true,
    dateAdded: true
}
};

export type PhysicalType = Prisma.physicalTypeGetPayload<typeof physicalType>;
export type PhysicalTypeInput = Prisma.physicalTypeCreateInput;