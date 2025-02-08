import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center px-4">
            <img src="/lost.jpg" alt="Lost" className="max-w-full w-80 md:w-96 lg:w-[400px] mb-6" />
            <h1 className="text-2xl font-bold">Uh Oh! Error 404</h1>
            <p className="text-lg text-gray-600 mb-6">It looks like you got lost far enough. Don't worry, try returning to the homepage.</p>
            <div className="flex gap-4">
                <Link to="/" className="cursor-pointer text-[#003D47]">
                    Home Page
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;