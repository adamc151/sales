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
import Loading from "../UI/Loading";

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
    const [type, setType] = useState(props.type);
    const [price2, setPrice2] = useState(0);
    const [price3, setPrice3] = useState(0);
    const [details, setDetails] = useState("");
    const [paymentType, setPaymentType] = useState(props.defaultPaymentType || "CARD");
    const [voucherType, setVoucherType] = useState("Voucher 1");
    const [otherPaymentType, setOtherPaymentType] = useState("OTHER");
    const [redirect, setRedirect] = useState(false);
    const [addButtonActive, setAddButtonActive] = useState(true);
    const [user, setUser] = useState(null);
    const [id, setId] = useState(null);
    const [loadingEdit, setLoadingEdit] = useState(props.isEdit);
    const prevLoading = usePrevious(props.data.addItemLoading);

    useEffect(() => {
        if (props.isEdit && !props.data.items) {
            props.actions.loadItems();
        }
        if (type === 'VOUCHER') {
            props.actions.getVouchers();
        }
    }, []);

    const setVoucherPrice = (argVoucherType) => {
        const currentVoucher = props.data.vouchers && props.data.vouchers.length && props.data.vouchers.find((voucher) => {
            return voucher.voucherType === argVoucherType;
        });
        if (currentVoucher) {
            setPrice1(currentVoucher.value);
        }
    }

    useEffect(() => {
        setVoucherPrice(voucherType);
    }, [props.data.vouchers]);

    console.log('yooo props.data.vouchers', props);

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
        props.setRightComponent(!props.isEdit ? <TopRight user={values.user} history={props.history} /> : null);

        if (prevLoading && !props.data.addItemLoading) {
            if (!props.data.error) {
                Swal.fire({
                    icon: "success",
                    title: `${type !== 'VOUCHER' ? `£${(price1 + price2 + price3).toFixed(2)}` : ''}`,
                    text: `Item ${props.isEdit ? 'updated' : 'added'} successfully`,
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

        if (props.isEdit) {
            if (props.data.items && props.data.items.length) {
                const url = window.location.pathname.split("/");
                const id = url[3];
                const myItem = props.data.items.find(item => item._id === id);

                if (!myItem) {
                    setLoadingEdit(false);
                    setRedirect(true);
                    return;
                }

                const { type, paymentMethod, details, breakdown, value, dateTime, _id } = myItem;
                setType(type);
                setDetails(details);
                setId(_id);

                if (paymentMethod !== 'CASH' && paymentMethod !== 'CARD' && paymentMethod !== 'AMEX') {
                    setPaymentType('OTHER');
                    setOtherPaymentType(paymentMethod);
                } else {
                    setPaymentType(paymentMethod);
                }

                setDate(new Date(dateTime));

                if (breakdown) {
                    const { lenses, accessories, fees } = breakdown;
                    setPrice1(lenses || 0);
                    setPrice2(accessories || 0);
                    setPrice3(fees || 0);
                } else {
                    setPrice1(value || 0);
                }
                setLoadingEdit(false);
            }
        }

    }, [props.data.addItemLoading, props.data.getItemsLoading]);


    if (redirect) {
        return <Redirect to={"/add-item"} />;
    }

    if (props.data.error && !props.data.items && props.isEdit) {
        return <Button className={styles.reload} onClick={() => { window.location.reload(); }}>Reload</Button>
    }
    if (loadingEdit) {
        return <Loading />
    }

    const handleSumbit = (e) => {
        e.preventDefault();
        e.target.querySelector("input").blur();
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.dateWrapper}>
                <span className={styles.date}>{moment(date).format("LLL")}</span>
                <span className={styles.changeDate} onClick={() => setShowDatePicker(!showDatePicker)} >
                    {showDatePicker ? "Done" : "Change"}
                </span>
            </div>
            {showDatePicker && (
                <div className={styles.datePicker}>
                    <MyDatePicker date={date} setDate={setDate} />
                </div>
            )}

            {type === 'VOUCHER' &&
                <div className={`${styles.multiselectWrapper} ${styles.voucherType}`} >
                    {props.data.vouchers && props.data.vouchers.map((voucher) => {

                        return <div className={`${styles.optionWrapper} ${voucherType === voucher.voucherType ? styles.isSelected : ""} `}
                            onClick={() => {
                                setVoucherType(voucher.voucherType);
                                setVoucherPrice(voucher.voucherType);
                            }} >
                            <div>{voucher.voucherType}</div>
                        </div>

                    })}
                </div>}

            <div>
                {type === 'DAILY' && <div className={styles.sectionText}>Daily Total (£)</div>}
                {type === 'EXPENSE' && <div className={styles.sectionText}>Expense (£)</div>}
                {type === 'REFUND' && <div className={styles.sectionText}>Refund Amount (£)</div>}
                {type === 'SALE' && <div className={styles.sectionText}>Spectacles/Contact Lenses (£)</div>}
                {type === 'VOUCHER' && <div className={styles.sectionText}>Voucher Value (£)</div>}

                {<div className={styles.priceWrapper}>
                    <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                        <input
                            className={`${styles.longInput}`}
                            type="number"
                            placeholder="0.00"
                            {...(props.isEdit || type === 'VOUCHER' && { value: price1 })}
                            onChange={(e) => {
                                setPrice1(Number(e.target.value));
                            }}
                        />
                    </form>
                </div>}
            </div>

            {type === 'SALE' &&
                <div>
                    <div className={styles.sectionText}>Accessories (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                {...(props.isEdit && { value: price2 })}
                                onChange={(e) => {
                                    setPrice2(Number(e.target.value));
                                }}
                            />
                        </form>
                    </div>
                </div>}

            {type === 'SALE' &&
                <div>
                    <div className={styles.sectionText}>Fees (£)</div>
                    <div className={styles.priceWrapper}>
                        <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                            <input
                                className={`${styles.longInput}`}
                                type="number"
                                placeholder="0.00"
                                {...(props.isEdit && { value: price3 })}
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
                        value={details}
                        onChange={(e) => {
                            setDetails(e.target.value);
                        }}
                    />
                </form>
            </div>
            {(type !== 'VOUCHER' && type !== 'DAILY') && <div className={styles.sectionText}>Payment Method</div>}

            {type === 'EXPENSE' &&
                <div className={`${styles.optionWrapper} ${paymentType === "CASH" ? styles.isSelected : ""} `} onClick={() => setPaymentType("CASH")}>
                    <div>{paymentMethodIcons.CASH}</div>
                    <div>CASH</div>
                </div>}

            {(type === 'SALE' || type === 'REFUND') &&
                <div className={styles.multiselectWrapper}>
                    <div className={`${styles.optionWrapper} ${paymentType === "CARD" ? styles.isSelected : ""} `} onClick={() => setPaymentType("CARD")}>
                        <div>{paymentMethodIcons.CARD}</div>
                        <div>CARD</div>
                    </div>
                    <div className={`${styles.optionWrapper} ${paymentType === "CASH" ? styles.isSelected : ""} `} onClick={() => setPaymentType("CASH")}>
                        <div>{paymentMethodIcons.CASH}</div>
                        <div>CASH</div>
                    </div>
                    <div className={`${styles.optionWrapper} ${paymentType === "AMEX" ? styles.isSelected : ""} `} onClick={() => setPaymentType("AMEX")}>
                        <div>{paymentMethodIcons.AMEX}</div>
                        <div>AMEX</div>
                    </div>
                    <div className={`${styles.optionWrapper} ${paymentType === "OTHER" ? styles.isSelected : ""} `} onClick={() => setPaymentType("OTHER")} style={{ marginRight: "0px" }}>
                        {"Other"}
                    </div>
                </div>}

            {paymentType === "OTHER" && <div>
                <div className={styles.sectionText}>Other payment method:</div>
                <form style={{ width: "100%" }} onSubmit={handleSumbit}>
                    <input
                        className={styles.longInput}
                        type="text"
                        {...(props.isEdit && { value: otherPaymentType })}
                        onChange={(e) => {
                            setOtherPaymentType(e.target.value);
                        }}
                    />
                </form></div>}

            <Button
                isLoading={props.data.addItemLoading}
                onClick={async () => {
                    if (addButtonActive) {
                        const team = props.data.team || await props.actions.getTeam();

                        setAddButtonActive(false);
                        const myPaymentType = paymentType === 'OTHER' ? otherPaymentType : paymentType;
                        if (price1 + price2 + price3 > 0 || type === 'VOUCHER') {
                            const myAction = props.isEdit ? props.actions.updateItem : props.actions.postItem;
                            await myAction({
                                type,
                                dateTime: date.toISOString(),
                                value: (price1 + price2 + price3).toFixed(2),
                                ...(details && { details }),
                                ...(type === 'SALE' || type === 'REFUND' || type === 'EXPENSE' && { paymentMethod: myPaymentType }),
                                ...(type === 'SALE' && {
                                    breakdown: {
                                        ...(price1.toFixed(2) > 0 && { lenses: price1.toFixed(2) }),
                                        ...(price2.toFixed(2) > 0 && { accessories: price2.toFixed(2) }),
                                        ...(price3.toFixed(2) > 0 && { fees: price3.toFixed(2) })
                                    }
                                }),
                                ...(type === 'VOUCHER' && { voucherType, paymentStatus: 'pending' }),
                                ...(!props.isEdit && { user: user ? team.find(item => item.name === user).id : "" }),
                                ...(id && { _id: id })
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
                {`${props.isEdit ? "Update" : "Add"} ${type === 'VOUCHER' ? 'Voucher' : `£${(price1 + price2 + price3).toFixed(2)}`}`}
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
