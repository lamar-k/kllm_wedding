import React from "react";
import './FAQ.css';
import Navigation from "../../Components/Navigation/Navigation";

function FAQ() {
    return (
        <>
        <div>
            <Navigation />
        </div>
        <div className="faq">
            <div className="faq-item">
                <p className="headers">Dress code for ceremony and reception? Let’s make it chic.</p>
                <p className="answers">Summer Formal.</p>

                <p className="answers">We kindly ask for ankle to floor-length dresses or suits with a jacket and tie.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Are children invited?</p>
                <p className="answers">Unfortunately, kids aren't invited to this one.</p>
            </div>
            <div className="faq-item">
                <p className="headers">What is the dress code for welcome party?</p>
                <p className="answers">We’re going for Elevated Summer Evening—stylish but relaxed.</p>
                <p className="answers">Think summer date night or an evening out with friends: dresses, stylish sets, or collared shirts paired with trousers.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Can I drive and park at the venue?</p>
                <p className="answers">The Courtyard by Marriott across the street offers valet parking for $25 per car. There is also street parking, as available.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Is the wedding indoor or outdoor?</p>
                <p className="answers">Partial indoor and outdoor. Venue is covered in event of rain.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Will transportation be provided?</p>
                <p className="answers">No, both recommended hotels are in walking distance to the venue.</p>
            </div>
        </div>
        </>
    );
}

export default FAQ;