import { type Role, type RoleInput } from '$lib/server/db/schema';
import type { Response } from '$lib/server/Response';
import { BaseModelController } from '../db/base';
import { prisma } from '../db/prisma';

export class RoleController extends BaseModelController {
	constructor(tableName: string) {
		super(tableName);
	}

	private convertMany = (res: Role[]) => res.map((r) => ({ ...r, id: Number(r.id) }));
	private convertSingle = (res: Role) => ({
		...res,
		id: Number(res.id)
	});

	public get = async () => {
		try {
			this.setOperation(`get${this.TABLE_NAME}s`);

			const data = await prisma.role.findMany().then(this.convertMany);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getById = async (id: number) => {
		try {
			this.setOperation(`get${this.TABLE_NAME}ById`);
			const data = await prisma.role
				.findUniqueOrThrow({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public getDropdown = async (): Response<{ label: string; value: number }[]> => {
		try {
			this.setOperation(`get${this.TABLE_NAME}Dropdown`);

			const data = await prisma.role
				.findMany()
				.then((res) => res.map((r) => ({ label: r.name, value: Number(r.id) })));
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public create = async (input: RoleInput) => {
		try {
			this.setOperation(`create${this.TABLE_NAME}`);
			const data = await prisma.role
				.create({
					data: input
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public update = async (input: RoleInput) => {
		try {
			this.setOperation(`update${this.TABLE_NAME}`);
			const data = await prisma.role
				.update({
					data: input,
					where: { id: input.id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};

	public delete = async (id: number) => {
		try {
			this.setOperation(`delete${this.TABLE_NAME}`);
			const data = await prisma.role
				.delete({
					where: { id }
				})
				.then(this.convertSingle);
			return this.success(data);
		} catch (err) {
			return this.error(err);
		}
	};
}
