import styles from "./List.module.css";

export const List = (props) => {
  return (
    <div className={styles.listDesktopWrapper}>
      <div className={styles.listWrapper}>{props.children}</div>
    </div>
  );
};

export const ListItem = ({ isActive, onClick, children }) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    const props = { isActive };
    if (React.isValidElement(child)) {
      return React.cloneElement(child, props);
    }
    return child;
  });
  return (
    <div className={styles.listItemWrapper} onClick={onClick}>
      {childrenWithProps}
    </div>
  );
};
