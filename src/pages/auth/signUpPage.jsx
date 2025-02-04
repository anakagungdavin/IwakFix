import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from 'react-router';
import SignUp from '../../components/forms/auth/signUp';

const SignUpPage = () => {
    return (
        <div className=" bg-gray-200 min-h-screen py-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <SignUp/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignUpPage