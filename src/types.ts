

export interface User {
	_id: string;
	name: {
		firstName: string;
		lastName: string;
	};
	role: string;
	email: string;
	avatar?: string;
}
