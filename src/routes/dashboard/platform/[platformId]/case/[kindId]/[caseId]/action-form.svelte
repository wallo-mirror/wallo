<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { actionFormSchema, type ActionFormSchema } from './action-schema';
	import type { PossibleAction } from '$lib/types';
	import Input from '$lib/components/ui/input/input.svelte';

	export let data: SuperValidated<Infer<ActionFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(actionFormSchema)
	});

	export let action: PossibleAction;
</script>

<form method="POST" action="?/action" class="flex-1">
	<Form.Field {form} name="id" class="hidden">
		<Form.Control let:attrs>
			<Input {...attrs} value={action.id} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="display" class="hidden">
		<Form.Control let:attrs>
			<Input {...attrs} value={action.display} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" variant={action.variant ?? 'default'}
		>{action.display ?? action.id}</Form.Button
	>
</form>
