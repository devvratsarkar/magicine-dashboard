import hands from "../../assets/images/medicine/hands.png"
import infant from "../../assets/images/medicine/infant.png"
import kidneys from "../../assets/images/medicine/kidneys.png"
import liver from "../../assets/images/medicine/liver.png"
import pregnant from "../../assets/images/medicine/pregnant.png"
import wine from "../../assets/images/medicine/wine.png"
export const saftyOptions = [
    { value: "safe", label: "Safe" },
    { value: "unsafe", label: "Unsafe" },
    { value: "caution", label: "Caution" },
    { value: "warning", label: "Warning" },
    { value: "danger", label: "Danger" },
    { value: "risky", label: "Risky" },
    { value: "hazard", label: "Hazard" },
    { value: "precaution", label: "Precaution" },
    { value: "harmful", label: "Harmful" },
    { value: "protective", label: "Protective" },
    { value: "consult your doctor", label: "Consult Your Doctor" },
    { value: "safe if prescribed", label: "Safe If Prescribed" },
];
export function getsafetyAdvice() {
    return [
        { src: wine, title: 'Alcohol', content: '', advices: '', },
        { src: pregnant, title: 'Pregnancy', content: '', advices: '', },
        { src: infant, title: 'Breast Feeding', content: '', advices: '', },
        { src: hands, title: 'Driving', content: '', advices: '', },
        { src: kidneys, title: 'Kidney', content: '', advices: '', },
        { src: liver, title: 'Liver', content: '', advices: '', },
    ]
}
export function getDefaultAccordionOrder() {
    return [
        { id: "1", title: "Description", content: '', status: true },
        { id: "2", title: "Uses", content: '', status: true },
        { id: "3", title: "Benefits", content: '', status: true },
        { id: "4", title: "Side Effects", content: '', status: true },
        { id: "5", title: "How To Use", content: '', status: true },
        { id: "6", title: "How It Works", content: '', status: true },
        { id: "7", title: "Safety Advice", content: '', status: true },
        { id: "8", title: "Missed Doses", content: '', status: true },
        { id: "9", title: "Quick Tips", content: '', status: true },
        { id: "10", title: "FAQs", content: '', status: true }
    ];
}
export const options = [
    { value: "cancer-medicines", label: "CANCER MEDICINES" },
    { value: "hiv-medicine", label: "HIV MEDICINES" },
    { value: "hepatitis-medicines", label: "HEPATITIS MEDICINES" },
    { value: "rheumatology", label: "RHEUMATOLOGY" },
    { value: "surgical-equipments", label: "SURGICAL EQUIPMENTS" },
];


export function getStoredAccordionOrder() {
    return JSON.parse(localStorage.getItem('accordionOrder'));
}
export function setStoredAccordionOrder(order) {
    const orderToStore = order.map(({ id, title, status }) => ({ id, title, status }));
    localStorage.setItem('accordionOrder', JSON.stringify(orderToStore));
}