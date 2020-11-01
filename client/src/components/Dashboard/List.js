import React, { useState } from "react";
import styles from "./List.module.css";
import {
    FaCcAmex,
    FaMoneyBillAlt,
    FaCreditCard,
} from "react-icons/fa";

const paymentMethodIcons = {
    CASH: <FaMoneyBillAlt color={"#53a957"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    CARD: <FaCreditCard color={"#d5ad43"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    AMEX: <FaCcAmex color={"#016fcf"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    OTHER: <span style={{ width: '20px', height: '20px', 'marginRight': '16px' }} />,
};

const List = (props) => {
    const [activePaymentTypes, setActivePaymentTypes] = useState(false);
    const [activeBreakdowns, setActiveBreakdowns] = useState(false);

    return (
        props.data.breakdowns ? <div className={styles.listDesktopWrapper}>
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
                            <span>{`${props.data.breakdowns.CARD.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.CARD.total)}`}</span>
                        </div>
                        <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.CASH}</span>
                                <span className={styles.paymentTypeText}>CASH</span>
                            </span>
                            <span>{`${props.data.breakdowns.CASH.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.CASH.total)}`}</span>
                        </div>
                        <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.AMEX}</span>
                                <span className={styles.paymentTypeText}>AMEX</span>
                            </span>
                            <span>{`${props.data.breakdowns.AMEX.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.AMEX.total)}`}</span>
                        </div>
                        {/* <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.OTHER}</span>
                                <span className={styles.paymentTypeText}>OTHER</span>
                            </span>
                            <span>{`${props.data.breakdowns.OTHER.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.OTHER.total)}`}</span>
                        </div> */}
                    </div>}
                </div>

                <div className={styles.newListItemWrapper} onClick={() => {
                    setActiveBreakdowns(!activeBreakdowns);
                }} >
                    <div className={styles.itemHeader}><div>Breakdowns</div><div>{activeBreakdowns ? '-' : '+'}</div></div>
                    {activeBreakdowns && <div className={styles.breakdownDetails}>
                        <div className={styles.breakdownType}><span>Sales</span><span>{`£${props.data.itemTypeBreakdowns.SALE.total}`}</span></div>
                        <div className={`${styles.breakdownType} ${styles.breakdownType2}`}><span className={styles.saleBreakdown}>- Lenses</span><span>{`£${props.data.saleBreakdowns.lenses.total}`}</span></div>
                        <div className={`${styles.breakdownType} ${styles.breakdownType2}`}><span className={styles.saleBreakdown}>- Accessories</span><span>{`£${props.data.saleBreakdowns.accessories.total}`}</span></div>
                        <div className={`${styles.breakdownType} ${styles.breakdownType2}`}><span className={styles.saleBreakdown}>- Fees</span><span>{`£${props.data.saleBreakdowns.fees.total}`}</span></div>
                        <div className={styles.breakdownType}><span>Refunds</span><span>{`${props.data.itemTypeBreakdowns.REFUND.total >= 0 ? '' : '-'} £${Math.abs(props.data.itemTypeBreakdowns.REFUND.total)}`}</span></div>
                        <div className={styles.breakdownType}><span>Expenses</span><span>{`${props.data.itemTypeBreakdowns.EXPENSE.total >= 0 ? '' : '-'} £${Math.abs(props.data.itemTypeBreakdowns.EXPENSE.total)}`}</span></div>
                    </div>}
                </div>
            </div>
        </div> : null
    );
};


export default List;