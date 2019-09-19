const React = require('react');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const Button = require('stremio/common/Button');
const styles = require('./styles');

const Checkbox = React.forwardRef((props, ref) => {
    return (
        <Button {...props} ref={ref} className={classnames(props.className, styles['checkbox-container'], { 'checked': props.checked })}>
            {
                props.checked ?
                    <svg className={styles['icon']} viewBox={'0 0 100 100'}>
                        <Icon x={'10'} y={'10'} width={'80'} height={'80'} icon={'ic_check'} />
                    </svg>
                    :
                    <Icon className={styles['icon']} icon={'ic_box_empty'} />
            }
            {props.children}
        </Button>
    );
});

Checkbox.displayName = 'Checkbox';

module.exports = Checkbox;
