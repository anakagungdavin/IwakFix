// import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from 'react-router';
import SignIn from '../../components/forms/auth/signIn';

const SignInPage = () => {
    return (
        <div className="flex items-center bg-gray-200 min-h-screen py-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="col-span-4">
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <SignIn/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SignInPage