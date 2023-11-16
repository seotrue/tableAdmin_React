import styles from './common.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Button = ({ text, onEvent }) => {
  return (
    <div onClick={onEvent} className={cx('registerBtn')}>
      {text}
    </div>
  );
};

export default Button;
