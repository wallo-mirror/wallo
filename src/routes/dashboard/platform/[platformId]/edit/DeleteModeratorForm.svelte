<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { X } from 'lucide-svelte';
	import { deleteModeratorFormSchema, type DeleteModeratorFormSchema } from './delete-moderator';

	export let data: SuperValidated<Infer<DeleteModeratorFormSchema>>;

	export let id: string;

	const form = superForm(data, {
		validators: zodClient(deleteModeratorFormSchema)
	});
</script>

<div>
	<form class="flex gap-2" method="POST">
		<Form.Field {form} name="id" class="hidden">
			<Form.Control let:attrs>
				<Input {...attrs} bind:value={id} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div>
			<Form.Button size="icon" variant="ghost" formaction="?/deleteModerator">
				<X />
			</Form.Button>
		</div>
	</form>
</div>
