export const LINK_URL = 'hospital-management-syst-996a1.web.app';
export const DLINK_URL = 'https://hmsappzambia.page.link';
export const policy = `HmsApp requires access to your local storage to enable user to upload images. HmsApp does not share user data with any third parties. 

Please send us an email if you have any feedback or suggestions.

`;
export const emailObj = {
	name: 'email',
	err: 'email required',
	type: 'email',
	val: '',
};
export const passwordObj = {
	name: 'password',
	err: 'password required',
	type: 'password',
	appex: 'password',
	val: '',
};
export const entry_form = {
	register_as: {
		body: '',
		title: 'Register As',
		action: 'Register',
		fullscreen: true,
		data: [
			{
				name: 'terms',
				err: 'must agree to the terms and conditions to register',
				type: 'checkbox',
				header: 'Terms & Conditions',
				policy,
				label:
					'I agree to receive emails from ZeroPen, and I have read and accepted the',
				span: 'terms and conditions',
				val: false,
			},
		],
	},
};
