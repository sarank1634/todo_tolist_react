import React from 'react';

function AuthForm({ title, children, onSubmit, serverError, buttonText, footer }) {
    return (
        <div className="auth-container">
            <h2>{title}</h2>
            {serverError && <p className="error">{serverError}</p>}
            <form onSubmit={onSubmit}>
                {children}
                <button type="submit">{buttonText}</button>
                <div className="auth-form-footer">
                    {footer}
                </div>
            </form>
        </div>
    );
}

export default AuthForm;
