import React, { useRef, useEffect, useState, Fragment } from "react";
import styles from "./Vouchers.module.css";
import {
    FaCcAmex,
    FaMoneyBillAlt,
    FaCreditCard,
    FaPlus,
} from "react-icons/fa";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../state/actions/dataActions";
import Loading from "../UI/Loading";
import { withRouter } from "react-router";
import moment from "moment";
import Swal from "sweetalert2";
import ViewportObserver from "../UI/ViewportObserver";

const paymentMethodIcons = {
    CASH: <FaMoneyBillAlt color={"#53a957"} />,
    CARD: <FaCreditCard color={"#d5ad43"} />,
    AMEX: <FaCcAmex color={"#016fcf"} />,
};


const ListItem = ({
    type,
    details,
    voucherType,
    paymentStatus,
    setPaymentStatus,
    paymentMethod,
    value,
    isActive,
    setActive,
    dateTime,
    _id,
    onDelete,
    history
}) => {
    return <div className={styles.listItemWrapper} onClick={() => setActive()} >
        <div>{paymentMethodIcons[paymentMethod]}</div>
        <div className={styles.detailsWrapper}>
            <div className={styles.productInfo}>
                {isActive ? (
                    <div className={styles.productDescriptionActive}>
                        <div className={styles.dateTime}>{moment(dateTime).format("LT")}</div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className={styles.sectionHeader} >Item Type</td>
                                    <td className={styles.sectionText} >{type}</td>
                                </tr>
                                <tr>
                                    <td className={styles.sectionHeader}>Voucher Type</td>
                                    <td className={styles.sectionText} >{voucherType}</td>
                                </tr>
                                <tr>
                                    <td className={styles.sectionHeader}>Payment Status</td>
                                    <td className={styles.sectionText} >{paymentStatus}</td>
                                </tr>
                                <tr>
                                    <td className={styles.sectionHeader}>Details</td>
                                    <td className={styles.sectionText} >{details}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                ) : (
                        <div className={styles.productDescription}>
                            <span>{moment(dateTime).format("LT")}</span>
                            <span className={styles.productDescriptionText}>
                                {" "}
                                {voucherType ? "- " : ""}
                                {voucherType}
                            </span>
                        </div>
                    )}
            </div>
            <div className={styles.productPrice}>
                {type === 'EXPENSE' || type === 'REFUND' ? "- " : ""}£{value}
            </div>
            {isActive && (
                <div className={styles.actions}>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(_id);
                        }}
                    >
                        Delete
          </span>
                    <span onClick={(e) => {
                        e.stopPropagation();
                        Swal.fire({
                            icon: 'warning',
                            text: "Are you sure you want to edit this item?",
                            showConfirmButton: true,
                            confirmButtonText: "Yes",
                            showCancelButton: true,
                            cancelButtonText: "No"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                history.push(`sales/edit/${_id}`);
                            } else if (result.isDenied) {
                                Swal.close();
                            }
                        });
                    }} >Edit</span>
                    <span onClick={(e) => {
                        e.stopPropagation();
                        paymentStatus === 'paid' ? setPaymentStatus(_id, 'pending') : setPaymentStatus(_id, 'paid');
                    }} >{paymentStatus === 'paid' ? "SET AS PENDING" : "SET AS PAID"}</span>
                </div>
            )}
        </div>
    </div>
};

const TopRight = (props) => {
    return (
        <>
            <div
                className={styles.addSale}
                onClick={() => { props.history.push("/add-item"); }}
            >
                <FaPlus size={"28px"} />
            </div>
        </>
    );
};

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

const Vouchers = (props) => {
    const [activeItem, setActiveItem] = useState(null);
    const prevLoading = usePrevious(props.data.getItemsLoading);
    const [isReady, setIsReady] = useState(false);
    const [currentPointer, setCurrentPointer] = useState(50);
    const [activeSection, setActiveSection] = useState('pending');

    useEffect(() => {
        window.scroll(0, 0);
        props.setTitle("NHS Vouchers");
        props.setRightComponent(<TopRight {...props} isOwner={props.auth.isOwner} />);
        props.setLeftComponent(null);
        props.actions.loadItems();
        props.actions.parseData(new Date(), 'month');

    }, []);

    if (prevLoading && !props.data.getItemsLoading) {
        !isReady && setIsReady(true);
        props.setRightComponent(
            <TopRight {...props} isOwner={props.auth.isOwner} />
        );
    }

    if (props.data.getItemsLoading || !isReady) {
        return <Loading />;
    }

    const deleteItem = async (id) => {
        Swal.queue([
            {
                icon: "warning",
                text: "Are you sure you want to delete this item?",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return props.actions
                        .deleteItem(id)
                        .then(() => {
                            setActiveItem(null);
                            props.actions.loadItems();
                            Swal.insertQueueStep({
                                icon: "success",
                                text: "Item successfully deleted",
                                timer: 2000,
                                showConfirmButton: false,
                                showClass: {
                                    popup: "",
                                },
                                allowOutsideClick: false,
                            });
                        })
                        .catch(() => {
                            Swal.showValidationMessage(`Something went wrong`);
                        });
                },
            },
        ]);
    };

    const setPaymentStatus = async (id, paymentStatus) => {
        Swal.queue([
            {
                icon: "warning",
                text: `Are you sure you want to set this Voucher as ${paymentStatus === 'paid' ? "PAID? This will now get added to your total sales as todays date" : "PENDING? This will now get removed from your total sales but date will stay the same as when set as PAID"}`,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return props.actions
                        .updateItem({
                            dateTime: (new Date()).toISOString(),
                            paymentStatus,
                            _id: id
                        })
                        .then(() => {
                            setActiveItem(null);
                            props.actions.loadItems();
                            Swal.insertQueueStep({
                                icon: "success",
                                text: "Item successfully updated",
                                timer: 2000,
                                showConfirmButton: false,
                                showClass: {
                                    popup: "",
                                },
                                allowOutsideClick: false,
                            });
                        })
                        .catch(() => {
                            Swal.showValidationMessage(`Something went wrong`);
                        });
                },
            },
        ]);
    };

    const reversedItems = props.data.items && props.data.items.slice(0).reverse();
    const pointer = currentPointer > props.data.items.length ? props.data.items.length : currentPointer;

    let visibleCount = 0;

    return (
        <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>
                <div className={styles.intervals}>
                    <span className={`${activeSection === 'pending' ? styles.activePendingInterval : ''} ${styles.interval}`} onClick={() => { setActiveSection('pending') }}>Pending</span>
                    <span className={`${activeSection === 'paid' ? styles.activePaidInterval : ''} ${styles.interval}`} onClick={() => { setActiveSection('paid') }}>Paid</span>
                </div>
                {reversedItems &&
                    reversedItems.slice(0, pointer).map((item, i) => {

                        if (item.type !== 'VOUCHER') return;
                        if (activeSection === 'pending' && item.paymentStatus !== 'pending') return;
                        if (activeSection === 'paid' && item.paymentStatus !== 'paid') return;

                        const current = new Date(item.dateTime);
                        const prev = i > 0 && new Date(reversedItems[i - 1].dateTime);
                        const isSame = i > 0 && moment(prev).isSame(moment(current), "day");
                        const date = item.dateTime;
                        visibleCount++;

                        return (
                            <Fragment key={`sales_${i}`}>
                                {(!isSame || visibleCount === 1) && date && (
                                    <div className={styles.dateHeader} >{moment(date).format("dddd D MMM")}</div>
                                )}
                                <ListItem
                                    {...item}
                                    history={props.history}
                                    onDelete={deleteItem}
                                    setPaymentStatus={setPaymentStatus}
                                    setActive={() =>
                                        i === activeItem ? setActiveItem(null) : setActiveItem(i)
                                    }
                                    isActive={i === activeItem}
                                />
                            </Fragment>
                        );
                    })}
                {props.data.items && pointer !== props.data.items.length && <ViewportObserver key={pointer} onIntersect={() => {
                    setTimeout(() => { setCurrentPointer(currentPointer + 50); }, 500);
                }}>{() => <div style={{ margin: '16px 0' }}>...loading</div>}</ViewportObserver>}
            </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Vouchers));
