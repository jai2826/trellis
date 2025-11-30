import { FormSchema } from "@/modules/customization/ui/components/customization-form";
import {
    useVapiAssistants,
    useVapiPhoneNumbers,
} from "@/modules/plugins/hooks/use-vapi-data";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@workspace/ui/components/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { UseFormReturn } from "react-hook-form";

interface VapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
  disabled?: boolean;
}

export const VapiFormFields = ({
  form,
  disabled,
}: VapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } =
    useVapiAssistants();
  const {
    data: phoneNumbers,
    isLoading: phoneNumbersLoading,
  } = useVapiPhoneNumbers();

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assitant</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={assistantsLoading || disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading assistants..."
                        : "Select an assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent align="start">
                <SelectItem value="none">None</SelectItem>
                {assistants?.map((assistant) => (
                  <SelectItem
                    value={assistant.id}
                    key={assistant.id}>
                    {assistant.name || "Unnamed Assistant"}{" "}
                    -{" "}
                    {assistant.model?.model ||
                      "Unknown Model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The Vapi assistant to use for voice calls
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assitant</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={phoneNumbersLoading || disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      phoneNumbersLoading
                        ? "Loading phone numbers..."
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent align="start">
                <SelectItem value="none">None</SelectItem>
                {phoneNumbers?.map((phoneNumber) => (
                  <SelectItem
                    value={
                      phoneNumber.number || phoneNumber.id
                    }
                    key={phoneNumber.id}>
                    {phoneNumber.number ||
                      "Unnamed Phone Number"}{" "}
                    - {phoneNumber.name || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Phone number to display in the widget
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
