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
                <p className="headers">Dress Code for ceremony and reception? Let’s make it chic.</p>
                <p className="answers">Summer Formal attire.</p>

                <p className="answers">We kindly ask for ankle to floor-length dresses or suits with a jacket and tie.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Are children invited?</p>
                <p className="answers">Unfortunately, kids aren't invited to this one.</p>
            </div>
            <div className="faq-item">
                <p className="headers">What is the dress code for welcome party?</p>
                <p className="answers">We’re going for Elevated Summer Evening—stylish but relaxed.</p>
                <p className="answers">Think summer date night or a night out with friends by the water: breezy dresses, elevated sets, or nice shirts with trousers.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Can I drive and park at the venue?</p>
                <p className="answers">The Courtyard Marriott across the street offers valet parking. Cost is $25 per car. There is also on street parking, as available.</p>
            </div>
            <div className="faq-item">
                <p className="headers">Is the wedding indoors or outdoors?</p>
                <p className="answers">Partial indoors and outdoors! Venue is covered in event of rain.</p>
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