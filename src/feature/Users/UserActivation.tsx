import React, {useEffect, useState} from 'react'
import {useUsersContext} from '../../core/context/UsersContext'
import {useToast} from '../../core/toast'
import {ScInputPassword} from "../../shared/InputPassword/InputPassword";
import {useForm} from "react-hook-form";
import {UserToActivate} from "../../core/api";
import {useI18n} from "../../core/i18n";
import {ScInput} from "../../shared/Input/ScInput";
import {makeStyles} from "@material-ui/core/styles";
import {Theme} from "@material-ui/core";
import {useCssUtils} from "../../core/helper/useCssUtils";
import {ScButton} from "../../shared/Button/Button";
import {Page, PageTitle} from "../../shared/Layout";
import querystring from "querystring";
import {useHistory, useLocation} from "react-router";


interface UserActivationForm extends UserToActivate {
    repeatPassword: string
}


const useStyles = makeStyles((t: Theme) => ({
    foot: {
        marginTop: t.spacing(2),
        display: 'flex',
        alignItems: 'center',
    },
}))


export const UserActivation = () => {
    const {m} = useI18n()
    const _activate = useUsersContext().activate
    const _tokenInfo = useUsersContext().fetchTokenInfo
    const cssUtils = useCssUtils()
    const css = useStyles()
    const {toastSuccess, toastError} = useToast()
    const {search} = useLocation()
    const history = useHistory()
    const [email, setEmail] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        formState: {errors},
    } = useForm<UserActivationForm>({
        mode: 'onChange', defaultValues: {email: ' '}
    },)

    useEffect(() => {
        const token = querystring.parse(search.replace(/^\?/, '')).token as string
        _tokenInfo.fetch({}, token).then(
            tokenInfo => {
                setEmail(tokenInfo.emailedTo)
            }
        )
    }, [])

    const onSubmit = async (form: UserActivationForm) => {
        console.log(form)
        await _activate.fetch({}, {...form, email: email}, '').catch((e) =>
            console.log("toto"))
    }
    return (
        <Page size="small">
            <PageTitle>{m.createMyAccount}</PageTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ScInput
                    className={cssUtils.marginBottom}
                    fullWidth
                    error={!!errors.email}
                    disabled={true}
                    label={m.email}
                    value={email}
                />
                <ScInput
                    className={cssUtils.marginBottom}
                    fullWidth
                    error={!!errors.firstName}
                    label={m.firstName}
                    {...register('firstName', {
                        required: {value: true, message: m.required}
                    })}
                />
                <ScInput
                    className={cssUtils.marginBottom}
                    fullWidth
                    error={!!errors.lastName}
                    label={m.lastName}
                    {...register('lastName', {
                        required: {value: true, message: m.required}
                    })}
                />
                <ScInputPassword
                    className={cssUtils.marginBottom}
                    inputProps={{
                        autocomplete: 'false',
                    }}
                    autoComplete="false"
                    error={!!errors.password}
                    helperText={errors.password?.message ?? ' '}
                    fullWidth
                    label={m.password}
                    {...register('password', {
                        required: {value: true, message: m.required},
                        minLength: {value: 8, message: m.passwordNotLongEnough},
                    })}
                />
                <ScInputPassword
                    className={cssUtils.marginBottom}
                    inputProps={{
                        autocomplete: 'false',
                    }}
                    autoComplete="false"
                    error={!!errors.repeatPassword}
                    helperText={errors.repeatPassword?.message ?? ' '}
                    fullWidth
                    label={m.newPasswordConfirmation}
                    {...register('repeatPassword', {
                        required: {value: true, message: m.required},
                        minLength: {value: 8, message: m.passwordNotLongEnough},
                        validate: value => value === getValues().password || m.passwordDoesntMatch,
                    })}
                />
                <div className={css.foot}>
                    <ScButton loading={_activate.loading} type="submit" color="primary" variant="contained">
                        {m.activateMyAccount}
                    </ScButton>
                </div>
            </form>
        </Page>
    )
}
