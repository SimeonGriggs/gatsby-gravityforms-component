import React from 'react'
import classnames from 'classnames'
import { outputDescription } from '../../utils/inputSettings'

const Radio = ({
    name,
    label,
    options,
    wrapClassName,
    className,
    register,
    description,
    descriptionPlacement,
}) => {
    return (
        <div className={wrapClassName}>
            <legend>{label}</legend>
            {outputDescription(description, descriptionPlacement, 'above')}
            {options.map((choice, index) => {
                const choiceID = index + 1
                return (
                    <div key={`${name}-${choiceID}`}>
                        <input
                            type="radio"
                            id={`${name}_${choiceID}`}
                            className={classnames(
                                'gravityform__field__input__radio',
                                'gravityform__field__input__radio--' + choiceID,
                                className
                            )}
                            name={`${name}`}
                            value={choice.value}
                            defaultChecked={choice.isSelected}
                            ref={register}
                        />
                        <label htmlFor={`${name}_${choiceID}`}>
                            {choice.text}
                        </label>
                    </div>
                )
            })}
            {outputDescription(description, descriptionPlacement, 'below')}
        </div>
    )
}

export default Radio
