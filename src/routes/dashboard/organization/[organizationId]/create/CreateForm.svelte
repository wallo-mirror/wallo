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

	const { form: formData, enhance } = form;
</script>

<h1 class="my-3 flex max-w-screen-sm place-content-between text-2xl font-extrabold">
	Create Platform
</h1>
<form class="flex max-w-screen-md flex-col gap-2" method="POST" use:enhance>
	<Form.Field {form} name="platformName">
		<Form.Control let:attrs>
			<Form.Label>Platform Name</Form.Label>
			<Input {...attrs} bind:value={$formData.platformName} />
		</Form.Control>
		<!-- <Form.Description>This is your organization display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="callbackUrl">
		<Form.Control let:attrs>
			<Form.Label>Callback URL</Form.Label>
			<Input {...attrs} bind:value={$formData.callbackUrl} />
		</Form.Control>
		<!-- <Form.Description>This is your organization display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
