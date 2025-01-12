import { ErrorMessage, Field, Formik, FormikProps } from 'formik';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useLoginUserMutation } from '../provider/queries/Auth.query';
import { toast } from 'sonner';
import axios from 'axios';

const Login = () => {
  const [LoginUser, LoginUserResponse] = useLoginUserMutation();
  const navigate = useNavigate();

  type User = {
    email: string;
    password: string;
  };

  const initialValues: User = {
    email: '',
    password: ''
  };

  const validationSchema = yup.object({
    email: yup.string().email('Email must be valid').required('Email is required'),
    password: yup.string().min(5, 'Password must be greater than 5 characters').required('Password is required')
  });

  const OnSubmitHandler = async (values: User, { resetForm }: { resetForm: () => void }) => {
    try {
      const { data, error }: any = await axios.post(`http://localhost:4000/api/user/login`, values)
      if (error) {
        toast.error(error.data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      resetForm();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#eee]">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={OnSubmitHandler}>
        {({ values, handleSubmit }: FormikProps<User>) => (
          <form onSubmit={handleSubmit} className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white">
            <div className="mb-3 py-1">
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg" placeholder="Enter Email Address" />
              <ErrorMessage component="p" className="text-red-500 text-sm" name="email" />
            </div>
            <div className="mb-3 py-1">
              <label htmlFor="password">Password</label>
              <Field name="password" id="password" className="w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg" placeholder="*****" />
              <ErrorMessage component="p" className="text-red-500 text-sm" name="password" />
            </div>
            <div className="mb-3 py-1 flex items-center justify-center">
              <Button disabled={LoginUserResponse.isLoading} loading={LoginUserResponse.isLoading} className="w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center">
                Submit
              </Button>
            </div>
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Don't Have An Account? <Link className="font-semibold" to={'/register'}>Register</Link>
              </p>
            </div>
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1">
                Forgot <Link className="font-semibold" to={'#'}>Password?</Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
