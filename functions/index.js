const functions = require('firebase-functions');

const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
db.settings({ timestampsInSnapshots: true });
 const PROFILE_URL = 'https://firebasestorage.googleapis.com/v0/b/umotto.appspot.com/o/istockphoto-1337144146-612x612.jpg?alt=media&token=9d25d951-4db4-4ab4-944d-8c9b13bf33d9';
 const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/hospital-management-syst-996a1.appspot.com/o/hms.png?alt=media&token=21deff3e-9238-4fe1-8d23-beb84da1d143';

const LINK_URL = 'https://hospital-management-syst-996a1.web.app';
const DLINK_URL = 'https://hmsappzambia.page.link';
const UUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
const sendEmailToUser = async ({
	emails,
	name,
	username,
	body,
	subject,
	link,
	imagePath,
}) => {
	///zhmykloyzpllmzep
	await db
		.collection('mail')
		.doc(UUUID())
		.set({
			to: emails,
			template: {
				name,
				data: {
					name: username,
					subject,
					body,
					link,
					imagePath,
				},
			},
		});
};
exports.appointmentUpdate= functions.firestore
.document('Appointment/{postId}')
.onWrite(async (change, context) => {
	const {postId}=context.params
    const contains = change.after.data();
    const bContains = change.before.data();
	try {
		if(contains.status===bContains.status&&
			contains.scheduleDate===bContains.scheduleDate){
				return
			}
		
	} catch (error) {
		
	}
	let link = `${DLINK_URL}?sd=$&si=${LOGO_URL}&st=$$&link=${LINK_URL}%2F%3Fid%3D${postId}%26type%3D2`;
	let body,subject
	let emails=[]
	let username= 'Registrar'
	if(contains?.status===2||contains?.status===1){
		const {profile=PROFILE_URL,name,}= (await db.doc(`Patient/${contains.patientId}`).get()).data()||{}
		if (contains?.status===1) {
			const allRegs= await db.collection('Registrar').where('role','==',true).get()
			if(allRegs.size>0){
				const {docs} =allRegs
				for (let index = 0; index < docs.length; index++) {
					const element = docs[index].data().email;
					emails.push(element)
				}
			}
			 body= `You have a new Request from ${name}`
				subject=`New Appointment Request (${postId})`
				link = link.replace('$',body).replace('$$',subject);
		await sendEmailToUser({
			emails,
			name: 'new_contact',
			username,
			body,
			subject,
			link,
			imagePath: profile,
		});
			
		}else if (contains?.status===2) {
			const {name:docName,email}= (await db.doc(`Doctor/${contains.doctorId}`).get()).data()||{}
			username= docName
			emails.push(email)
			 body= `You have a confirmed appoint to see ${name}`
			 subject=`Confirmed Appointment (${postId})`
			const linkHolder=link
			const doclink = linkHolder.replace('$',body).replace('$$',subject);
			 await sendEmailToUser({
				 emails,
				 name: 'new_contact',
				 username,
				 body,
				 subject,
				 link:doclink,
				 imagePath: profile,
			 });
			 const pBody=``
			 const pSub=``
			 const patientlink = linkHolder.replace('$',pBody).replace('$$',pSub);
			 await sendEmailToUser({
				 emails,
				 name: 'new_contact',
				 username:name,
				 body:pBody,
				 subject:pSub,
				 link:patientlink,
				 imagePath: LOGO_URL,
			 });
		}
	}
})
exports.addShare = functions.https.onCall(
	async ({ emails, payload, body, subject, dLink, socialImageLink },context) => {
        if (!context.auth.token.role?.Registrar) {
            return {
              message: `access denied`,
            };
          }
		try {
			const { url } = payload;
			for (let index = 0; index < emails.length; index++) {
				const userData = emails[index];
				let user;
				try {
					if (typeof userData === 'object') {
						console.log('userData ', userData);
						user = await auth.getUser(userData.userId);
					} else {
						console.log('email route ', userData);

						user = await auth.getUserByEmail(userData);
					}
					console.log('user ', user);
				} catch (error) {
					console.log('error ', error.message);
				}
				const {
					uid = UUUID(),
					email = userData,
					displayName,
				} = user || {};
				
					let link = dLink; /// 'https://zeropen.edu';
						try {
							link = `${DLINK_URL}?sd=${body.replaceAll(
								' ',
								'%2520',
							)}&si=${socialImageLink}&st=${subject.replaceAll(
								' ',
								'%2520',
							)}&link=${LINK_URL}%2F%3Fid%3D${uid}%26admin%3D${
								payload.userId
							}%26type%3D1%26password%3Dtrue`;
							console.log('link ', link);
						} catch (error) {
							console.log('link error ', error.message);
						}
					
					//https://zeropen.page.link?sd=You%2520have%2520been%2520added%2520as%2520staff%2520member%2520of%2520Ventures%2520school%2520&si=https://firebasestorage.googleapis.com/v0/b/zeropen-d4946.appspot.com/o/zeropen-blu.png?alt=media&token=0ee29a66-8f00-4369-999a-ee966da3b292&st=Staff%2520Member%2520Invite}&link=https://zeropen-d4946.web.app%2F%3Fid%3De503f04b-2509-4056-bd07-18fd781a23e8%26admin%3Dkan5sA0OycNXb4mEefpsdHCTRbN2%26type%3D0
					//https://zeropen-d4946.firebaseapp.com/auth/params?mode=verifyEmail&oobCode=zHGQ2w2XmhfFYHNewJohKjYdY3z2HD_CzShjsDrOLusAAAGGX-0ojw&apiKey=AIzaSyB5xcz13Q8gB388LpF_-jkiC10uCTMx7k4&continueUrl=https%3A%2F%2Fzeropen.page.link%3Fsd%3DYou%252520have%252520been%252520added%252520as%252520staff%252520member%252520of%252520Ventures%252520school%252520%26si%3Dhttps%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fzeropen-d4946.appspot.com%2Fo%2Fzeropen-blu.png%3Falt%3Dmedia%26token%3D0ee29a66-8f00-4369-999a-ee966da3b292%26st%3DStaff%252520Member%252520Invite%26link%3Dhttps%3A%2F%2Fzeropen-d4946.web.app%252F%253Fid%253D52d0627f-51da-4b04-a070-a694d7ecead6%2526admin%253D8dMivSXvLddaKTMLx2BR0tq3CDv2%2526type%253D1%2526password%253Dtrue&lang=en
					//https://zeropen-d4946.firebaseapp.com/auth/params?mode=verifyEmail&oobCode=MCw_t3jHJnw0WfRZnBjQb7jiRAfJGKxHrtOXNCziuCUAAAGGXlLjnQ&apiKey=AIzaSyB5xcz13Q8gB388LpF_-jkiC10uCTMx7k4&continueUrl=https%3A%2F%2Fzeropen.page.link%3Fsd%3DJoin%2520Ventures%2520school%2520%2520on%2520ZeroPen.%26si%3Dhttps%253A%252F%252Ffirebasestorage.googleapis.com%252Fv0%252Fb%252Fzeropen-d4946.appspot.com%252Fo%252Fzeropen-blu.png%253Falt%253Dmedia%2526token%253D0ee29a66-8f00-4369-999a-ee966da3b292%26st%3DJoin%2520ZeroPen%2520App%26amv%3D3%26apn%3Dedu.zeropen.zeropen%26link%3Dhttps%253A%252F%252Fzeropen-d4946.web.app%252F%253Fid%253D28408181-c8b4-4c58-a94c-5b8ae513ce1a%2526type%253D0&lang=en
					const val=payload.role;
					const {Doctor,Registrar}=val;
					const categoryId=Doctor?'Doctor':Registrar?"Registrar":"Patient"
					let tempUser={}
					if (!user) {
						const name = (
							displayName || email.includes("@") ?
							  email.substring(0, email.indexOf("@")) :
							  email
						  ).toLowerCase();
						tempUser={
							name,
							email,
							categoryId,
							[`${categoryId.toLowerCase()}Id`]:  uid,
							timestamp: admin.firestore.FieldValue.serverTimestamp(),
						  }
						const actionCodeSettings = {
							url: `${link}`,
						};
						const userRecord = await auth.createUser({
							email,
							emailVerified: true,
							password: 'password',
							disabled: false,
							displayName: (email.includes('@')
								? email.substring(0, email.indexOf('@'))
								: email
							).toLowerCase(),
							uid,
						});
						await auth.updateUser(userRecord.uid, {
							...userRecord,
							emailVerified: false,
						});

						await auth.setCustomUserClaims(userRecord.uid, {
							categoryId,
							role: val,
							status: 0,
						});
						link = await auth.generateEmailVerificationLink(
							email,
							actionCodeSettings,
						);
					}else{
						const {customClaims = {}} = user;
						const {Doctor,Registrar}=customClaims;
					    const catId=Doctor?'Doctor':Registrar?"Registrar":"Patient"
						if(categoryId!==catId){
							const currentProfile= await db.doc(`${catId}/${uid}`).get()
							if(currentProfile.exists){
								tempUser=currentProfile.data()
							}
						}
						await auth.setCustomUserClaims(uid, {
							...customClaims,
							categoryId,
							role: val,
						});
					}
					
					await db.doc(`${categoryId}/${uid}`).set({
						...tempUser,
						role: val,
						[`roleVal`]: Object.values(val).some((bool)=>bool),
						updatedAt: admin.firestore.FieldValue.serverTimestamp(),
					  }, {merge: true});
					await sendEmailToUser({
						emails: email,
						name: 'new_contact',
						username: displayName || 'User',
						body,
						link,
						subject,
						imagePath: url,
					});
				
			}
			return {
				message: `successful`,
			};
		} catch (err) {
			return {
				message: err.message,
			};
		}
	},
);
const addTokens=async(email,payload)=>{
	try {
		const user = await auth.getUserByEmail(email);

		if (user) {
			const { customClaims = {} } = user;
			await auth.setCustomUserClaims(user.uid, {
				...customClaims,
				...payload,
			});
		}

		return {
			message: `successful`,
		};
	} catch (err) {
		return {
			message: err.message,
		};
	}
}
exports.addCustom = functions.https.onCall(async (data) => {
	const { email, payload } = data;

	console.log('data ', data, 'email ', data.email);
	const res= await addTokens(email,payload)
	return res
});
exports.regUser = functions.https.onCall(async (data) => {
	const { id, email, name, password,categoryId } = data;

	try {
		let user;
		try {
			if (id) {
				user = await auth.getUser(id);
			} else {
				user = await auth.getUserByEmail(email);
			}
			if (password && user) {
				const { customClaims = {}, uid } = user;
				const { status } = customClaims;
				if (status) {
					user = null;
				} else {
					await auth.updateUser(uid, { displayName: name, password });
					await db.doc(`${categoryId}/${uid}`).update({
						name,
						updatedAt: admin.firestore.FieldValue.serverTimestamp(),
					});
				}
			}
		} catch (error) {}

		return {
			message: `successful`,
			user,
		};
	} catch (err) {
		return {
			message: err.message,
		};
	}
});
