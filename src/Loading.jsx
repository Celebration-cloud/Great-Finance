/* eslint-disable react/prop-types */
function Loading({color}) {
  return (
    <div className={`spinner-border ${color}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default Loading
