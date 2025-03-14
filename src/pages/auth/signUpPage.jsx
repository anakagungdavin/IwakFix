// import Breadcrumb from '../../breadcrumb/breadcrumb';
// import { useNavigate } from 'react-router';
// import SignUp from '../../components/forms/auth/signUp';

// const SignUpPage = () => {
//     return (
//         <div className=" bg-gray-200 min-h-screen px-117 py-5">
//             {/* <div className="max-w-7xl mx-auto"> */}
//                 {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> */}
//                     {/* <div className="col-span-4"> */}
//                         <div className="bg-white shadow-md rounded-lg p-4">
//                             <SignUp/>
//                         </div>
//                     {/* </div> */}
//                 {/* </div> */}
//             {/* </div> */}
//         </div>
//     )
// }
// export default SignUpPage

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