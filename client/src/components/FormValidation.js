import * as Yup from 'yup';

export const FormValidation = Yup.object({
    emailOrPhone: Yup.string().required("Please Enter email or phone"),
    password : Yup.string().min(6).required("Please enter password")
});