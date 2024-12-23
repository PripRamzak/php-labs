import { useEffect, useState } from "react"
import { Card } from "react-bootstrap";
import { API_URL } from "../utils/consts";


function CityCard({ city }) {
    const [imageError, setImageError] = useState('')
    const [imageSrc, setImageSrc] = useState(null)


    const checkImage = async () => {
        try {
            const response = await fetch(`${API_URL}../img/cities/${city.img}`);
            if (!response.ok) {
                // Устанавливаем код ошибки, если изображение не загружается
                handleError(response.status);
                return;
            }

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onerror = () => {
                    setImageError('Файл поврежден');
                };
            };

            reader.readAsDataURL(blob);
            setImageSrc(URL.createObjectURL(blob));
        } catch (error) {
            setImageError('Ошибка при загрузке изображния');
            console.error('Ошибка при загрузке изображения:', error);
        }
    };

    const handleError = (status) => {
        if (status == 404) {
            setImageError('Изображение не найдено');
        }
        else if (status == 403) {
            setImageError('Нет прав доступа');
        }
    }

    useEffect(() => {
        checkImage();
    }, [city])

    return (
        <Card className="text-center" style={{ width: 350, borderWidth: '2px' }}>
            <Card.Body>
                <Card.Title className='d-flex justify-content-center'>{city.name}</Card.Title>
                {imageError &&
                    <Card.Text>{imageError}</Card.Text>}
                {!imageError && imageSrc &&
                    <Card.Img className='mt-1' width={300} height={200} src={imageSrc} />}
            </Card.Body>
        </Card>
    )
}

export default CityCard;