import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  rollNo: z.string().regex(/^CB\d{4}$/, 'Invalid roll number format (e.g., CB2201)'),
  department: z.string().min(2, 'Department is required'),
  year: z.number().min(1).max(4),
  semester: z.number().min(1).max(8),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      year: 3,
      semester: 5,
    },
  });

  const onSubmit = async (data: SignupForm) => {
    try {
      setLoading(true);
      await signup(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-primary">
            <GraduationCap size={40} />
            <h1 className="text-4xl font-bold">EduStatus</h1>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Roll Number"
              placeholder="CB2201"
              {...register('rollNo')}
              error={errors.rollNo?.message}
            />
            
            <Input
              label="Department"
              {...register('department')}
              error={errors.department?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year"
                type="number"
                min={1}
                max={4}
                {...register('year', { valueAsNumber: true })}
                error={errors.year?.message}
              />
              
              <Input
                label="Semester"
                type="number"
                min={1}
                max={8}
                {...register('semester', { valueAsNumber: true })}
                error={errors.semester?.message}
              />
            </div>
            
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}