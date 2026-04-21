<script lang="ts">
	import { enhance } from '$app/forms';
	import PostForm from '$lib/components/PostForm.svelte';
	import type { ProfileInput } from '$lib/server/db/schema.js';
	import {
		mdiBabyBottle,
		mdiHumanFemale,
		mdiHumanMale,
		mdiHumanPregnant,
		mdiRun,
		mdiRunFast,
		mdiSeat,
		mdiWalk,
		mdiWeightLifter
	} from '@mdi/js';
	import clsx from 'clsx';
	import { Button, DateField, Icon, TextField } from 'svelte-ux';

	let { data, form } = $props();

	let input: Partial<ProfileInput> = $state({
		id: data.profile?.profile.id,
		birthDate: data.profile?.profile.birthDate,
		physicalTypeId: data.profile?.profile.physicalTypeId,
		heightFeet: data.profile?.profile.heightFeet,
		heightInch: data.profile?.profile.heightInch,
		activityLevelId: data.profile?.profile.activityLevelId,
		weight: data.profile?.profile.weight
	});
	let activityLevels = $derived(data.activityLevels ? data.activityLevels : []);
	let physicalTypes = $derived(data.physicalTypes ? data.physicalTypes : []);
</script>

<div class="flex flex-col gap-4 mx-auto">
	<PostForm {form} />

	<DateField name="birthDate" label="Birth Date" bind:value={input.birthDate} picker />
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="label">Physical Factor</label>
	<div class="flex flex-row gap-4">
		{#each physicalTypes as phys (phys.value)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={clsx(
					'flex-1 border border-black elevation-2 shadow-sm py-4 hover:cursor-pointer hover:bg-blue-200 hover:text-white',
					input.physicalTypeId === phys.value && 'bg-blue-500 text-white'
				)}
				onclick={() => {
					input.physicalTypeId = phys.value;
					input = input;
				}}
			>
				<Icon
					path={phys.label === 'Male'
						? mdiHumanMale
						: phys.label === 'Female'
							? mdiHumanFemale
							: phys.label === 'Pregnant'
								? mdiHumanPregnant
								: mdiBabyBottle}
				/>
				{phys.label}
			</div>
		{/each}
	</div>
	<div class="flex flex-row gap-2">
		<TextField
			name="heightFeet"
			label="Height (feet)"
			type="integer"
			classes={{ root: 'flex-1' }}
			bind:value={input.heightFeet}
		/>
		<TextField
			name="heightInch"
			label="Height (inches)"
			type="integer"
			classes={{ root: 'flex-1' }}
			bind:value={input.heightInch}
		/>
	</div>
	<TextField name="weight" label="Weight (lbs)" bind:value={input.weight} />
	<div class="flex flex-row gap-2">
		{#each activityLevels as level (level.id)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={clsx(
					'flex-1 border border-black elevation-2 shadow-sm py-4 hover:cursor-pointer hover:bg-primary-200 hover:text-white',
					input.activityLevelId === level.id && 'bg-primary-500 text-white'
				)}
				onclick={() => {
					input.activityLevelId = level.id;
				}}
			>
				<div class="grid grid-cols-[auto,1fr]">
					<Icon
						path={level.multiplier == '1.200'
							? mdiSeat
							: level.multiplier == '1.375'
								? mdiWalk
								: level.multiplier == '1.550'
									? mdiRun
									: level.multiplier == '1.725'
										? mdiRunFast
										: mdiWeightLifter}
					/>
					<span>{level.name}</span>
					<span class="col-span-2 text-xs">{level.description}</span>
				</div>
			</div>
		{/each}
	</div>

	<form method="post" id="createProfileForm" action="/profile" use:enhance>
		<input type="hidden" name="input" value={JSON.stringify(input)} />
		<Button class="bg-primary w-fit text-white" type="submit">Submit</Button>
	</form>
</div>
