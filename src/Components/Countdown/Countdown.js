import React, {useEffect, useState} from "react";
import './Countdown.css';
;
const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date("2026-06-13T21:30:00");
        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="countdown">
            <div className="countdown-timer">
                <div className="countdown-sections">
                    <h4 className="countdown-figures">{timeLeft.days}</h4>
                    <h4 className="countdown-desc">Days</h4>
                </div>
                <div className="countdown-sections">
                    <h4 className="countdown-figures">{timeLeft.hours}</h4>
                    <h4 className="countdown-desc">Hours</h4>
                </div>
                <div className="countdown-sections">
                    <h4 className="countdown-figures">{timeLeft.minutes}</h4>
                    <h4 className="countdown-desc">Minutes</h4>
                </div>
                <div className="countdown-sections">
                    <h4 className="countdown-figures">{timeLeft.seconds}</h4>
                    <h4 className="countdown-desc">Seconds</h4>
                </div>
            </div>
        </div>
    );
}

export default Countdown;