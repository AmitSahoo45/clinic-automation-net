namespace ClinicAppointments.Api.Common;

public sealed record OperationResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage)
{
    public static OperationResult Success(int statusCode = StatusCodes.Status204NoContent) =>
        new(true, statusCode, null);

    public static OperationResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage);

    public static OperationResult NotFound(string errorMessage) =>
        new(false, StatusCodes.Status404NotFound, errorMessage);

    public static OperationResult Conflict(string errorMessage) =>
        new(false, StatusCodes.Status409Conflict, errorMessage);
}
