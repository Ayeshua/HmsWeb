import { bool, number,object,string } from "yup";
export function parseData(payload){
  console.log('payload ',payload);
    return payload.data.reduce((cal,value)=>{
        const {name,val,err,type,min}=value
        const res={...cal,initData:{...cal.initData,[name]:val}}
        console.log('payload value ',value);

        if(err){
          console.log('payload value ',err);

            if (type === 'number') {
                return {...res, schema:{...res.schema,[name]: number().min(min,`must not be less than ${min}`).required(err)}};
              } else if (type === 'phone') {
                const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

                return {...res, schema:{
                  ...res.schema,
                  [name]: string().trim().matches(phoneRegExp, 'Phone number is not valid')
                }};
              } else if (type === 'checkbox') {
                return {...res, schema:{...res.schema,[name]: bool().required().oneOf([true], err)}};
              } else  if (type === 'password') {
                return {...res, schema:{...res.schema,[name]: string().trim().required('password required')
                    .matches(/(?=.{8,})/, 'Must Contain at least 8 Characters')}};
              } else  if (type === 'email') {
                return {...res, schema:{...res.schema,[name]: string().trim()
                  .email('Enter valid email')
                  .required('email required')}};
              } else{
                return {...res, schema:{...res.schema,[name]: string().trim().required(err)}};
              }
        }
        return res
    },{...payload,object,initData:{},schema:{}})
}