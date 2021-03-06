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
    history,
    isOwner,
    user
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
                                <tr>
                                    <td className={styles.sectionHeader} >User</td>
                                    <td className={styles.sectionText} >{user}</td>
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
            <div className={styles.userAndPrice}>
                <span style={{ color: 'grey' }}>
                    {!isActive ? user : ''}
                </span>
                <div className={styles.productPrice}>
                    {type === 'EXPENSE' || type === 'REFUND' ? "- " : ""}£{value}
                </div>
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
                    {isOwner ? <span onClick={(e) => {
                        e.stopPropagation();
                        paymentStatus === 'paid' ? setPaymentStatus(_id, 'pending') : setPaymentStatus(_id, 'paid');
                    }} >{paymentStatus === 'paid' ? "SET AS PENDING" : "SET AS PAID"}</span> : null}
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
    const INCREMENT = 50;
    const [activeItem, setActiveItem] = useState(null);
    const prevLoading = usePrevious(props.data.getItemsLoading);
    const [isReady, setIsReady] = useState(false);
    const [currentPointer, setCurrentPointer] = useState(INCREMENT);
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
        return <Loading withSidebar={true} />;
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
                        .then(async () => {
                            setActiveItem(null);
                            await props.actions.loadItems();
                            await props.actions.parseData();
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

    const reversedItems = props.data.items && props.data.items.length && props.data.items.slice(0).reverse();
    const pointer = props.data.items && currentPointer > props.data.items.length ? props.data.items.length : currentPointer;

    let visibleCount = 0;
    let prev;

    return (
        <div className={styles.listDesktopWrapper}>
            <div className={styles.listWrapper}>
                {props.auth.isOwner ? <div className={styles.intervals}>
                    <span className={`${activeSection === 'pending' ? styles.activePendingInterval : ''} ${styles.interval}`} onClick={() => { setActiveSection('pending') }}>Pending</span>
                    <span className={`${activeSection === 'paid' ? styles.activePaidInterval : ''} ${styles.interval}`} onClick={() => { setActiveSection('paid') }}>Paid</span>
                </div> : null}
                {reversedItems ?
                    activeSection === 'pending' && props.data.vouchersTotal && props.data.vouchersTotal.pending &&
                    <div className={styles.pendingTotalsWrapper}>
                        <div className={styles.sectionTextGrey}>Pending Totals</div>
                        {Object.keys(props.data.vouchersTotal.pending).map((voucher) => {
                            return <div className={styles.pendindVoucher}><div>{voucher}</div><div>£{props.data.vouchersTotal.pending[voucher].total}</div></div>
                        })}
                    </div> : null}
                {reversedItems ?
                    reversedItems.slice(0, pointer).map((item, i) => {
                        if (item.type !== 'VOUCHER') return;
                        if (activeSection === 'pending' && item.paymentStatus !== 'pending') return;
                        if (activeSection === 'paid' && item.paymentStatus !== 'paid') return;

                        const current = new Date(item.dateTime);
                        const isSame = i > 0 && prev && moment(prev).isSame(moment(current), "day");
                        const isSameMonth = i > 0 && prev && moment(prev).isSame(moment(current), "month");
                        const date = item.dateTime;

                        prev = current;
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
                                    isOwner={props.auth.isOwner}
                                />
                            </Fragment>
                        );
                    }) : null}
                {pointer !== props.data.items.length && <ViewportObserver key={pointer} onIntersect={() => {
                    setTimeout(() => { setCurrentPointer(currentPointer + INCREMENT); }, 500);
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
