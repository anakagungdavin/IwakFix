// import Breadcrumb from '../../breadcrumb/breadcrumb';
import { useNavigate } from "react-router";
import SignIn from "../../components/forms/auth/signIn";

const SignInPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-6">
          <SignIn />
        </div>
      </div>
    </div>
  );
};
export default SignInPage;
