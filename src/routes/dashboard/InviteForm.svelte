<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Check, X } from 'lucide-svelte';
	import { inviteFormSchema, type InviteFormSchema } from './invite-schema';

	export let data: SuperValidated<Infer<InviteFormSchema>>;

	export let platformId: string;

	const form = superForm(data, {
		validators: zodClient(inviteFormSchema)
	});
</script>

<div>
	<form class="flex gap-2" method="POST">
		<Form.Field {form} name="platformId" class="hidden">
			<Form.Control let:attrs>
				<Input {...attrs} bind:value={platformId} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<div class="flex gap-4">
			<Form.Button size="icon" variant="destructive" formaction="?/deleteInvite">
				<X />
			</Form.Button>
			<Form.Button size="icon" formaction="?/acceptInvite">
				<Check />
			</Form.Button>
		</div>
	</form>
</div>
