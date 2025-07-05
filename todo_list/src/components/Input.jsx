function Input({ label, type = 'text', name, register, error, ...props }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input 
                type={type} 
                {...register(name, { required: `${label} is required` })} 
                {...props} 
            />
            {error && <span className="error">{error.message}</span>}
        </div>
    );
}

export default Input;
