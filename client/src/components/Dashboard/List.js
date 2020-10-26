import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import {
    FaCcAmex,
    FaMoneyBillAlt,
    FaCreditCard,
} from "react-icons/fa";

const paymentMethodIcons = {
    CASH: <FaMoneyBillAlt color={"#53a957"} size={"24px"} style={{ 'margin-right': '16px' }} />,
    CARD: <FaCreditCard color={"#d5ad43"} size={"24px"} style={{ 'margin-right': '16px' }} />,
    AMEX: <FaCcAmex color={"#016fcf"} size={"24px"} style={{ 'margin-right': '16px' }} />,
};

const List = (props) => {
    const [activePaymentTypes, setActivePaymentTypes] = useState(false);
    const [activeBreakdowns, setActiveBreakdowns] = useState(false);

    return (
        props.data.breakdowns && false ? <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>
                <div className={styles.newListItemWrapper} onClick={() => {
                    setActivePaymentTypes(!activePaymentTypes);
                }} >
                    <div className={styles.itemHeader}><div>Payment Types</div><div>{activePaymentTypes ? '-' : '+'}</div></div>
                    {activePaymentTypes && <div className={styles.itemDetails}>
                        <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.CARD}</span>
                                <span className={styles.paymentTypeText}>CARD</span>
                            </span>
                            <span>{`${props.data.breakdowns.CARD.total > 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.CARD.total)}`}</span>
                        </div>
                        <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.CASH}</span>
                                <span className={styles.paymentTypeText}>CASH</span>
                            </span>
                            <span>{`${props.data.breakdowns.CASH.total > 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.CASH.total)}`}</span>
                        </div>
                        <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.AMEX}</span>
                                <span className={styles.paymentTypeText}>AMEX</span>
                            </span>
                            <span>{`${props.data.breakdowns.AMEX.total > 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.AMEX.total)}`}</span>
                        </div>
                    </div>}
                </div>

                <div className={styles.newListItemWrapper} onClick={() => {
                    setActiveBreakdowns(!activeBreakdowns);
                }} >
                    <div className={styles.itemHeader}><div>Breakdowns</div><div>{activeBreakdowns ? '-' : '+'}</div></div>
                    {activeBreakdowns && <div className={styles.breakdownDetails}>
                        <div className={styles.breakdownType}><span>Lenses</span><span>{`£${props.data.saleBreakdowns.lenses.total}`}</span></div>
                        <div className={styles.breakdownType}><span>Accessories</span><span>{`£${props.data.saleBreakdowns.accessories.total}`}</span></div>
                        <div className={styles.breakdownType}><span>Fees</span><span>{`£${props.data.saleBreakdowns.fees.total}`}</span></div>
                    </div>}
                </div>
            </div>
        </div> : null
    );
};


export default List;