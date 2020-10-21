import React, { useEffect, useState, useRef } from "react";
import styles from "./AddItem.module.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaCcAmex,
    FaMoneyBillAlt,
    FaCreditCard,
    FaAngleLeft,
    FaUser
} from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import { Redirect, withRouter } from "react-router";
import Swal from "sweetalert2";
import { Button } from "../UI/Button";
import queryString from 'query-string'

const TopRight = ({ user, history }) => {
    return (
        <div className={styles.topRight} onClick={() => {
            Swal.fire({
                text: "Would you like to change user?",
                showConfirmButton: true,
                confirmButtonText: "Yes",
                showCancelButton: true,
                cancelButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                    history.push('/home');
                } else if (result.isDenied) {
                    Swal.close();
                }
            });
        }}>
            <FaUser /><span className={styles.topRightUser}>{user}</span>
        </div>
    );
};

const paymentMethodIcons = {
    CASH: <FaMoneyBillAlt color={"#53a957"} size={"28px"} />,
    CARD: <FaCreditCard color={"#d5ad43"} size={"20px"} />,
    AMEX: <FaCcAmex color={"#016fcf"} size={"24px"} />,
};

const MyDatePicker = ({ date, setDate }) => {
    return (
        <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            locale="pt-BR"
            showTimeSelect
            timeFormat="p"
            timeIntervals={15}
            dateFormat="Pp"
            inline
        />
    );
};

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const AddItemNew = (props) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [price1, setPrice1] = useState(0);
    const [price2, setPrice2] = useState(0);
    const [price3, setPrice3] = useState(0);
    const [details, setDetails] = useState("");
    const [paymentType, setPaymentType] = useState(props.defaultPaymentType || "CARD");
    const [otherPaymentType, setOtherPaymentType] = useState("OTHER");
    const [redirect, setRedirect] = useState(false);
    const [addButtonActive, setAddButtonActive] = useState(true);
    const [user, setUser] = useState(null);

    const prevLoading = usePrevious(props.data.addItemLoading);

    useEffect(() => {
        const values = queryString.parse(props.location.search);
        setUser(values.user);
        props.setTitle(props.title);
        props.setLeftComponent(() => (
            <div
                className={styles.backNavigation}
                onClick={() => {
                    props.history.goBack();
                }}
            >
                <FaAngleLeft size={"32px"} />
            </div>
        ));
        props.setRightComponent(<TopRight user={values.user} history={props.history} />);

        if (prevLoading && !props.data.addItemLoading) {
            if (!props.data.error) {
                const item = props.data.items[props.data.items.length - 1];
                Swal.fire({
                    icon: "success",
                    title: `£${item.value}`,
                    text: "Item added successfully",
                    timer: 2000,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
                setTimeout(() => {
                    setRedirect(true);
                }, 2000);
            } else {
                setAddButtonActive(true);
            }
        }
    }, [props.data.addItemLoading]);

    const buttonText = () => {
        return `Add £${(price1 + price2 + price3).toFixed(2)}`;
    };

    if (redirect) {
        return <Redirect to={"/home"} />;
    }

    const handleSumbit = (e) => {
        e.preventDefault();
        e.target.querySelector("input").blur();
    };

    console.log('yoooo props.data.', props.data);

    return (
        <div className={styles.wrapper}>
            <div className={styles.dateWrapper}>
                <span className={styles.date}>{moment(date).format("LLL")}</span>
                <span
                    className={styles.changeDate}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                >
                    {showDatePicker ? "Done" : "Change"}
                </span>
            </div>
            {showDatePicker && (
                <div className={styles.datePicker}>
                    <MyDatePicker date={date} setDate={setDate} />
                </div>
            )}

            {props.type === 'EXPENSE' &&
                <div>
                    <div className={styles.sectionText}>Expense (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => {
                                    setPrice1(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            {props.type === 'REFUND' &&
                <div>
                    <div className={styles.sectionText}>Refund Amount (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => {
                                    setPrice1(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            {props.type === 'SALE' &&
                <div>
                    <div className={styles.sectionText}>Spectacles/Contact Lenses (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => {
                                    setPrice1(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            {props.type === 'SALE' &&
                <div>
                    <div className={styles.sectionText}>Accessories (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => {
                                    setPrice2(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            {props.type === 'SALE' &&
                <div>
                    <div className={styles.sectionText}>Fees (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                onChange={(e) => {
                                    setPrice3(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            <div>
                <div className={styles.sectionText}>Details</div>
                <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                    <input
                        className={styles.longInput}
                        type="text"
                        onChange={(e) => {
                            setDetails(e.target.value);
                        }}
                    />
                </form>
            </div>
            <div className={styles.sectionText}>Payment Method</div>

            {props.type === 'EXPENSE' &&
                <div
                    className={`${styles.optionWrapper} ${paymentType === "CASH" ? styles.isSelected : ""
                        }`}
                    onClick={() => setPaymentType("CASH")}
                >
                    <div>{paymentMethodIcons.CASH}</div>
                    <div>CASH</div>
                </div>}

            {(props.type === 'SALE' || props.type === 'REFUND') &&
                <div className={styles.multiselectWrapper}>
                    <div
                        className={`${styles.optionWrapper} ${paymentType === "CARD" ? styles.isSelected : ""
                            }`}
                        onClick={() => setPaymentType("CARD")}
                    >
                        <div>{paymentMethodIcons.CARD}</div>
                        <div>CARD</div>
                    </div>
                    <div
                        className={`${styles.optionWrapper} ${paymentType === "CASH" ? styles.isSelected : ""
                            }`}
                        onClick={() => setPaymentType("CASH")}
                    >
                        <div>{paymentMethodIcons.CASH}</div>
                        <div>CASH</div>
                    </div>
                    <div
                        className={`${styles.optionWrapper} ${paymentType === "AMEX" ? styles.isSelected : ""
                            }`}
                        onClick={() => setPaymentType("AMEX")}
                    >
                        <div>{paymentMethodIcons.AMEX}</div>
                        <div>AMEX</div>
                    </div>
                    <div
                        className={`${styles.optionWrapper} ${paymentType === "OTHER" ? styles.isSelected : ""
                            }`}
                        onClick={() => setPaymentType("OTHER")}
                        style={{ marginRight: "0px" }}
                    >
                        {"Other"}
                    </div>
                </div>}

            {paymentType === "OTHER" && <div>
                <div className={styles.sectionText}>Other payment method:</div>
                <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                    <input
                        className={styles.longInput}
                        type="text"
                        onChange={(e) => {
                            setOtherPaymentType(e.target.value);
                        }}
                    />
                </form></div>}

            <Button
                isLoading={props.data.addItemLoading}
                onClick={async () => {
                    if (addButtonActive) {
                        setAddButtonActive(false);
                        const myPaymentType = paymentType === 'OTHER' ? otherPaymentType : paymentType;
                        if (price1 + price2 + price3 > 0) {
                            await props.actions.postItem({
                                dateTime: date.toISOString(),
                                value: (price1 + price2 + price3).toFixed(2),
                                paymentMethod: myPaymentType,
                                ...(details && { details }),
                                user: user ? props.data.team.find(item => item.name === user).id : "",
                                ...(props.type === 'SALE' && {
                                    breakdown: {
                                        ...(price1.toFixed(2) > 0 && { lenses: price1.toFixed(2) }),
                                        ...(price2.toFixed(2) > 0 && { accessories: price2.toFixed(2) }),
                                        ...(price3.toFixed(2) > 0 && { fees: price3.toFixed(2) })
                                    }
                                }),
                                type: props.type
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                text: "Cannot add item with value £0",
                                timer: 2000,
                                showConfirmButton: false
                            });
                            setAddButtonActive(true);
                        }
                    }
                }}
            >
                {buttonText()}
            </Button>
        </div >
    );
};

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(AddItemNew));
