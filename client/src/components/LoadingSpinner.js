import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
    return <div className='text-center mt-4'>
        <Spinner style={{ width: "12rem", height: "12rem" }} />
        <h2>Загрузка</h2>
    </div>;
}

export default LoadingSpinner;