using Gov.Jag.Embc.Public.DataInterfaces;
using Gov.Jag.Embc.Public.Utils;
using Gov.Jag.Embc.Public.ViewModels;
using System.Threading.Tasks;

namespace Gov.Jag.Embc.Public.Services
{
    public interface IRegistrationService
    {
        Task<Registration> CreateNewAsync(Registration registration);

        Task UpdateAsync(Registration registration);

        Task<Registration> GetEvacueeRegistrationAsync(string id);

        Task<RegistrationSummary> GetEvacueeRegistrationSummaryAsync(string id);

        Task<bool> DeactivateEvacueeRegistrationAsync(string id);
    }

    public class RegistrationService : IRegistrationService
    {
        private readonly IEmailSender emailSender;
        private readonly IDataInterface di;

        public RegistrationService(IDataInterface di, IEmailSender emailSender)
        {
            this.di = di;
            this.emailSender = emailSender;
        }

        public async Task<ViewModels.Registration> Handle(CreateNewRegistrationCommand request, CancellationToken cancellationToken)
        {
            var registration = request.Registration;
            registration.Id = null;
            registration.Active = true;
            var result = await dataInterface.CreateEvacueeRegistrationAsync(registration);
            if (!string.IsNullOrWhiteSpace(result.HeadOfHousehold.Email))
            {
                var registrationEmail = CreateEmailMessageForRegistration(result);
                emailSender.Send(registrationEmail);
            }
            return result;
        }

        private EmailMessage CreateEmailMessageForRegistration(ViewModels.Registration registration)
        {
            var essRegistrationLink = @"<a target='_blank' href='https://justice.gov.bc.ca/embcess/self-registration'>Evacuee Self-Registration</a>";
            var emergencyInfoBCLink = @"<a target='_blank' href='https://www.emergencyinfobc.gov.bc.ca/'>Emergency Info BC</a>";

            var subject = "Registration completed successfully";
            var body = $@"
This email has been generated by the Emergency Support Services program to provide you with a record of your Emergency Support Services File Number. If you have not registered online via the {essRegistrationLink} and are receiving this email, please contact your family members to ensure they have not registered on your behalf. If you have received this email in error, please disregard. Your Emergency Support Services File Number is: <b>{registration.EssFileNumber}</b>
";

            // var body = "<h2>Evacuee Registration Success</h2><br/>" + "<b>What you need to know:</b><br/><br/>" +
            //    $"Your Emergency Support Services File Number is: <b>{registration.EssFileNumber}</b>";

            if (registration.IncidentTask == null)
            {
                // append more if the incident task is not yet set.
                body += $@"
<br/>
<br/>
- If you are under order and require food, clothing, lodging, transportation, incidentals or other emergency supports, proceed to your nearest Reception Centre. A list of open Reception Centres can be found at {emergencyInfoBCLink}.<br/>
- Please bring your Emergency Support Services File Number with you to the Reception Centre.<br/>
- If you do not require emergency support services, or are under alert, no further actions are required.<br/>
- If you are in a Reception Centre, proceed to one of the Emergency Support Services volunteers on site who will be able to assist you with completing your registration.<br/>
                ";
            }

            return new EmailMessage(registration.HeadOfHousehold.Email, subject, body);
        }

        public async Task UpdateAsync(Registration registration)
        {
            await di.UpdateEvacueeRegistrationAsync(registration);
        }

        public async Task<Registration> GetEvacueeRegistrationAsync(string id)
        {
            return await di.GetEvacueeRegistrationAsync(id);
        }

    public class CreateNewRegistrationCommand : IRequest<ViewModels.Registration>
    {
        public CreateNewRegistrationCommand(ViewModels.Registration registration)
        {
            Registration = registration;
        }

        public ViewModels.Registration Registration { get; }
    }
}