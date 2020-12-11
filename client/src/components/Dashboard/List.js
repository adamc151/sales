import React, { useState } from "react";
import styles from "./List.module.css";
import {
    FaCcAmex,
    FaMoneyBillAlt,
    FaCreditCard,
    FaHistory
} from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

const paymentMethodIcons = {
    CASH: <FaMoneyBillAlt color={"#53a957"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    CARD: <FaCreditCard color={"#d5ad43"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    AMEX: <FaCcAmex color={"#016fcf"} size={"20px"} style={{ 'marginRight': '16px' }} />,
    VOUCHER: <MdLocalHospital size={"18px"} style={{ 'marginRight': '16px' }} />,
    DAILY: <FaHistory size={"18px"} style={{ 'marginRight': '16px' }} />,
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
                        {props.data.breakdowns.VOUCHER.total ? <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.VOUCHER}</span>
                                <span className={styles.paymentTypeText}>NHS VOUCHERS *no payment type</span>
                            </span>
                            <span>{`${props.data.breakdowns.VOUCHER.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.VOUCHER.total)}`}</span>
                        </div> : null}
                        {props.data.breakdowns.DAILY.total ? <div className={styles.paymentType}>
                            <span className={styles.paymentTypeInner}>
                                <span className={styles.paymentTypeIcon}>{paymentMethodIcons.DAILY}</span>
                                <span className={styles.paymentTypeText}>DAILY *no payment type</span>
                            </span>
                            <span>{`${props.data.breakdowns.DAILY.total >= 0 ? '' : '- '} £${Math.abs(props.data.breakdowns.DAILY.total)}`}</span>
                        </div> : null}
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
                        {props.data.itemTypeBreakdowns.VOUCHER.total ? <>
                            <div className={styles.breakdownType}><span>NHS VOUCHERS</span><span>{`${props.data.itemTypeBreakdowns.VOUCHER.total >= 0 ? '' : '-'} £${Math.abs(props.data.itemTypeBreakdowns.VOUCHER.total)}`}</span></div>
                            {Object.keys(props.data.itemTypeBreakdowns.VOUCHER.breakdown).map((voucher) => {
                                return props.data.itemTypeBreakdowns.VOUCHER.breakdown[voucher].total > 0 ? <div className={`${styles.breakdownType} ${styles.breakdownType2}`}><span className={styles.saleBreakdown}>{`- ${voucher}`}</span><span>{`£${props.data.itemTypeBreakdowns.VOUCHER.breakdown[voucher].total}`}</span></div> : null;
                            })}
                        </> : null}
                        {props.data.itemTypeBreakdowns.DAILY.total ? <div className={styles.breakdownType}><span>DAILY</span><span>{`${props.data.itemTypeBreakdowns.DAILY.total >= 0 ? '' : '-'} £${Math.abs(props.data.itemTypeBreakdowns.DAILY.total)}`}</span></div> : null}

                    </div>}
                </div>
            </div>
        </div> : null
    );
};


export default List;