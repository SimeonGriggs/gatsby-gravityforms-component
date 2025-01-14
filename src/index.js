import React, { useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import PropTypes from 'prop-types'
import useForm from 'react-hook-form'
import getForm from './utils/getForm'
import FieldBuilder from './container/FieldBuilder'
import FormGeneralError from './components/FormGeneralError'
import { doesObjectExist, isObjEmpty } from './utils/helpers'
import {
    handleGravityFormsValidationErrors,
    manageMainFormError,
} from './utils/manageErrors'
import { submittionHasOneFieldEntry } from './utils/manageFormData'
import passToGravityForms from './utils/passToGravityForms'

/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param mixed     formData    Form dataset from graphQL
 * @param int       id          Form ID from Gravity Forms
 * @param string    lambda      API link for Lambda functions when working with
 *                              netlify or similar
 */

const GravityFormForm = ({ id, formData, lambda, presetValues = {} }) => {
    // Pull in form functions
    const { register, errors, handleSubmit, watch, setError } = useForm()

    // Create general error state
    const [generalError, setGeneralError] = useState('')

    // State for confirmation message
    const [confirmationMessage, setConfirmationMessage] = useState('')

    const watchAllForm = watch()

    // Take ID argument and graphQL Gravity Form data for this form
    const singleForm = getForm(formData, id)

    const onSubmitCallback = async values => {
        // Check that at least one field has been filled in
        if (submittionHasOneFieldEntry(values)) {
            let restResponse = await passToGravityForms(
                singleForm.apiURL,
                values,
                lambda
            )

            if (restResponse.status == 'error') {
                // Handle the errors
                // First check to make sure we have the correct data
                if (doesObjectExist(restResponse.data)) {
                    // Validation errors passed back by Gravity Forms
                    if (restResponse.data.status === 'gravityFormErrors') {
                        // Pass messages to handle that sets react-hook-form errors
                        handleGravityFormsValidationErrors(
                            restResponse.data.validation_messages,
                            setError
                        )
                    }
                } else {
                    console.log(restResponse)
                    // FILL OUT ERROR
                    // Seemed to be an unknown issue
                }
            }

            if (restResponse.status == 'success') {
                setConfirmationMessage(
                    restResponse.data.data.confirmation_message
                )
            }
        } else {
            setGeneralError('leastOneField')
        }
    }

    // FIX ERROR CLEANER
    // if (!isObjEmpty(errors)) {
    //     setGeneralError('formHasError')
    // } else {
    //     // If there is an error currently, and there is one
    //     // field populated, clean up
    //     if (generalError && submittionHasOneFieldEntry(watchAllForm)) {
    //         setGeneralError('')
    //     }
    // }
    if (!confirmationMessage) {
        return (
            singleForm && (
                <form
                    id={`gravityform--id-${id}`}
                    className={`gravityform gravityform--id-${id}`}
                    key={`gravityform--id-${id}`}
                    onSubmit={handleSubmit(onSubmitCallback)}
                >
                    {(!isObjEmpty(errors) || generalError) && (
                        <FormGeneralError errorCode={generalError} />
                    )}

                    <FieldBuilder
                        formId={id}
                        formData={singleForm}
                        presetValues={presetValues}
                        register={register}
                        errors={errors}
                    />
                    <button type="submit">
                        {singleForm.button.text
                            ? singleForm.button.text
                            : 'Submit'}
                    </button>
                </form>
            )
        )
    } else {
        return ReactHtmlParser(confirmationMessage)
    }
}

export default GravityFormForm

GravityFormForm.defaultProps = {
    lambda: '',
}

GravityFormForm.propTypes = {
    formData: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    lambda: PropTypes.string,
}
