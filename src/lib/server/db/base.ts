export class BaseModelController {
	protected TABLE_NAME: string;
	protected operation: string = '';

	constructor(tableName: string) {
		this.TABLE_NAME = tableName;
	}

	protected setOperation = (operation: string) => {
		this.operation = operation;
		this.logStart();
	};

	private logStart = () => {
		const startTime: Date = new Date();
		console.log(
			`Begining operation ${this.operation} for ${this.TABLE_NAME} at ${startTime.toDateString()} ${startTime.toTimeString()}`
		);
	};

	private logComplete = () => {
		const completeTime: Date = new Date();
		console.log(
			`Completed operation ${this.operation} for ${this.TABLE_NAME} at ${completeTime.toDateString()} ${completeTime.toTimeString()}`
		);
	};

	private logError = (error: string) => {
		const errorTime: Date = new Date();
		console.error(
			`Error occurred during operation ${this.operation} for ${this.TABLE_NAME} at ${errorTime.toDateString()} ${errorTime.toTimeString()}. Full error is ${error}`
		);
	};

	protected returnOneRecord = <T>(results: T[]) => {
		if (results.length !== 1) throw Error('Only expected one record.');

		return results[0];
	};

	protected success = <T>(data: T) => {
		this.logComplete();
		return { status: 200, data, message: '' };
	};

	protected error = (err: unknown) => {
		this.logError(`${err}`);
		return { status: 500, data: undefined, message: `${err}` };
	};
}
