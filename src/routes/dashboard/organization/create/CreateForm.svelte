<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData } = form;
</script>

<h1 class="my-3 flex max-w-screen-sm place-content-between text-2xl font-extrabold">
	Create Organization
</h1>
<form class="flex max-w-screen-md flex-col gap-2" method="POST">
	<Form.Field {form} name="organization_name">
		<Form.Control let:attrs>
			<Form.Label>Organization Name</Form.Label>
			<Input {...attrs} bind:value={$formData.organization_name} />
		</Form.Control>
		<!-- <Form.Description>This is your organization display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
