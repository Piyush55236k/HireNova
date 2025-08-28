import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarLoader } from 'react-spinners';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from './ui/input';
import useFetch from '@/hooks/use-fetch';
import { addNewCompanies } from '@/api/apicompanies';

const schema = z.object({
  Name: z.string().min(1, { message: "Company name is required" }),
  Logo: z.any().refine(
    (files) =>
      files?.[0] &&
      (files[0].type === "image/png" || files[0].type === "image/jpeg"),
    { message: "Only PNG or JPEG images are allowed" }
  ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompanies);

  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      Logo: data.Logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany) {
      fetchCompanies();
      reset();
    }
  }, [dataAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
          <DrawerDescription>Fill in the details below to register a new company.</DrawerDescription>

          <form className="flex flex-col gap-4 p-4 pb-0">
            <Input
              placeholder="Company name"
              {...register("Name")}
            />
            {errors.Name && (
              <p className="text-red-500 text-sm">{errors.Name.message}</p>
            )}

            <Input
              type="file"
              accept="image/png, image/jpeg"
              className="file:text-gray-500"
              {...register("Logo")}
            />
            {errors.Logo && (
              <p className="text-red-500 text-sm">{errors.Logo.message}</p>
            )}

            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
              className="w-40"
              disabled={loadingAddCompany}
            >
              {loadingAddCompany ? "Adding..." : "Add"}
            </Button>

            {errorAddCompany?.message && (
              <p className="text-red-500 text-sm">{errorAddCompany.message}</p>
            )}

            {loadingAddCompany && (
              <BarLoader width={"100%"} color="#36d7b7" />
            )}
          </form>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;