// --- Tab Components ---

const TabContainer = ({
  title,
  children,
  onSubmit,
  loading,
  error,
  response,
  TableComponent, // New prop for custom table rendering
}) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    <form onSubmit={onSubmit} className="space-y-4 mb-6">
      {children}
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
    </form>

    {error && (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )}

    {response && (
      <>
        {/* Render custom table component if provided */}
        {TableComponent && <TableComponent data={response} />}

        <div className="bg-gray-50 p-4 rounded-md shadow-inner mt-6">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Raw JSON Response:
          </h3>
          <pre className="whitespace-pre-wrap break-all text-xs bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </>
    )}
  </div>
);
export default TabContainer;