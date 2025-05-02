import './LoadingDots.css';

export default function LoadingDots() {
    return (
        <div className='absolute top-1/2 left-1/2'>
            <div className='flex'>
                <div className="loading-dot size-4 rounded-full mr-2 bg-orange-500"></div>
                <div className="loading-dot size-4 rounded-full mr-2 bg-orange-600"></div>
                <div className="loading-dot size-4 rounded-full mr-2 bg-orange-500"></div>
                <div className="loading-dot size-4 rounded-full mr-2 bg-orange-600"></div>
                <div className="loading-dot size-4 rounded-full mr-2 bg-orange-500"></div>
            </div>
        </div>
    );
}
