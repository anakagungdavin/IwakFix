// SignUpPage.jsx
import Breadcrumb from "../../breadcrumb/breadcrumb";
import { useNavigate } from "react-router";
import SignUp from "../../components/forms/auth/signUp";

const SignUpPage = () => {
  return (
    <div className="bg-gray-200 min-h-screen py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
            <div className="bg-white shadow-md rounded-lg">
              <SignUp />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

// SignUp.jsx (key parts that need modification)
// This doesn't need to be the full component, but note these changes:

/*
The main issue is in this part:
<div className="w-full p-4 sm:p-12.5 xl:p-17.5">
    
This is causing excessive padding on larger screens, and
the "max-w-full overflow-x-auto" wrapper is redundant since
the form doesn't need horizontal scrolling.
*/
